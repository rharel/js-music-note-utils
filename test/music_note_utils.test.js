const assert = require("chai").assert;

const MNU = require("../dist/music_note_utils");

const PitchClass = MNU.PitchClass;
const Accidental = MNU.Accidental;
const Note = MNU.Note;
const NoteIndex = MNU.NoteIndex;


describe("frequency choice for A4", () =>
{
	it("should have a sensible default", () =>
	{
		assert.strictEqual(MNU.A4_frequency, 440);
	});
	it("should sanitize values being set", () =>
	{
		MNU.A4_frequency = "445";
		assert.strictEqual(MNU.A4_frequency, 445);

		MNU.A4_frequency = "440";
		assert.strictEqual(MNU.A4_frequency, 440);
	})
});
describe("PitchClass enumeration", () =>
{
	it("should contain all 7 class letters", () =>
	{
		"ABCDEFG".split("").forEach((letter, index) =>
		{
			assert(PitchClass.hasOwnProperty(letter));
			assert.strictEqual(PitchClass[letter].index, index);
			assert.strictEqual(PitchClass[letter].letter, letter);
		});
	});
	it("should allow access by index", () =>
	{
		for (let i = 0; i < 7; ++i)
		{
			const pitch_class = PitchClass.with_index(i);
			assert.strictEqual(pitch_class.index, i);
			assert.strictEqual(pitch_class.letter, "ABCDEFG"[i]);
		}
	});
});
describe("Accidental enumeration", () =>
{
	it("should map members to their note index shifts", () =>
	{
		assert.strictEqual(Accidental.None.shift, 0);
		assert.strictEqual(Accidental.Sharp.shift, 1);
		assert.strictEqual(Accidental.Flat.shift, -1);
	});
});
describe("Note object", () =>
{
	const G4 = new Note(PitchClass.G);
	const A4_flat = new Note(PitchClass.A, Accidental.Flat);
	const A4 = new Note(PitchClass.A);
	const A4_sharp = new Note(PitchClass.A, Accidental.Sharp);
	const B4_flat = new Note(PitchClass.B, Accidental.Flat);
	const B4 = new Note(PitchClass.B);

	const C5 = new Note(PitchClass.C, Accidental.None, 5);
	const B3 = new Note(PitchClass.B, Accidental.None, 3);

	describe("vanilla constructor", () =>
	{
		it("should apply parameters", () =>
		{
			assert.strictEqual(A4_sharp.pitch_class, PitchClass.A);
			assert.strictEqual(A4_sharp.accidental, Accidental.Sharp);
			assert.strictEqual(A4_sharp.octave, 4);
		});
	});
	describe("constructor from frequency", () =>
	{
		it("should handle exact values", () =>
		{
			assert(Note.from_frequency(440).equals(A4));
		});
		it("should handle approximate values", () =>
		{
			assert(Note.from_frequency(445).equals(A4));
		})
	});
	describe("constructor from index", () =>
	{
		it("should handle integer indices", () =>
		{
			assert(Note.from_index(0).equals(A4));
		});
		it("should round non-integer indices ", () =>
		{
			assert(Note.from_index(0.4).equals(A4));
			assert(Note.from_index(-0.5).equals(A4));
		})
	});
	describe("constructor from midi numbers", () =>
	{
		it("should produce the right notes", () =>
		{
			assert(Note.from_midi_number(69).equals(A4));
			assert(Note.from_midi_number(72).equals(C5));
			assert(Note.from_midi_number(59).equals(B3));
		});
	});
	describe("constructor from string", () =>
	{
		it("should handle natural bare notes", () =>
		{
			assert(Note.from_string("A").equals(A4));
		});
		it("should handle accidental bare notes", () =>
		{
			assert(Note.from_string("A#").equals(A4_sharp));
			assert(Note.from_string("Ab").equals(A4_flat));
		});
		it("should handle fully qualified notes", () =>
		{
			assert(Note.from_string("A4").equals(A4));
			assert(Note.from_string("A#4").equals(A4_sharp));
			assert(Note.from_string("Ab4").equals(A4_flat));

			assert(Note.from_string("C5").equals(C5));
			assert(Note.from_string("B3").equals(B3));
		});
		it("should handle ridiculous notes", () =>
		{
			assert(Note.from_string("A#12345")
				.equals(new Note(PitchClass.A, Accidental.Sharp, 12345)));
		});
	});
	describe("convenience constructors", () =>
	{
		it("should have one for each pitch class", () =>
		{
			"ABCDEFG".split("").forEach(letter =>
			{
				assert
				(
					Note[letter](Accidental.None, 4),
					Note.from_string(letter + "4")
				);
				assert
				(
					Note[letter](Accidental.Sharp, 4),
					Note.from_string(letter + "#4")
				);
				assert
				(
					Note[letter](Accidental.Flat, 4),
					Note.from_string(letter + "b4")
				);
			});
		});
	});
	describe("cloning", () =>
	{
		it("should create an equal clone", () =>
		{
			assert(A4.equals(A4.clone()));
			assert.notStrictEqual(A4.clone(), A4);
		});
	});
	describe("transposition", () =>
	{
		it("should transpose by the specified amount of semi-tones", () =>
		{
			assert(A4.transpose(0).equals(A4));

			assert(A4.transpose(1).equals(A4_sharp));
			assert(A4_sharp.transpose(1).equals(B4));

			assert(A4.transpose(-1).equals(A4_flat));
			assert(A4_flat.transpose(-1).equals(G4));
		});
	});
	describe("variant creation", () =>
	{
		it("should create sharps", () =>
		{
			assert(A4.sharp().equals(A4_sharp));
			assert(A4_sharp.sharp().equals(A4_sharp));
			assert(A4_flat.sharp().equals(A4_sharp));
		});
		it("should create flats", () =>
		{
			assert(A4.flat().equals(A4_flat));
			assert(A4_sharp.flat().equals(A4_flat));
			assert(A4_flat.flat().equals(A4_flat));
		});
		it("should create naturals", () =>
		{
			assert(A4.natural().equals(A4));
			assert(A4_sharp.natural().equals(A4));
			assert(A4_flat.natural().equals(A4));
		});
	});
	describe("equality", () =>
	{
		it("should depend solely on index", () =>
		{
			assert(A4_sharp.equals(B4_flat));
		});
		it("should be reflexive", () =>
		{
			assert(A4.equals(A4));
		});
		it("should be symmetric", () =>
		{
			assert(A4_sharp.equals(B4_flat));
			assert(B4_flat.equals(A4_sharp));

			assert.isFalse(A4.equals(B3));
			assert.isFalse(B3.equals(A4));
		});
	});
	describe("index computation", () =>
	{
		it("should be the inverse of Note.from_index()", () =>
		{
			assert.strictEqual(Note.from_index(-13).index(), -13);
			assert.strictEqual(Note.from_index(-12).index(), -12);
			assert.strictEqual(Note.from_index(-11).index(), -11);

			assert.strictEqual(Note.from_index(-8).index(), -8);
			assert.strictEqual(Note.from_index(-4).index(), -4);
			assert.strictEqual(Note.from_index(-2).index(), -2);
			assert.strictEqual(Note.from_index(-1).index(), -1);
			assert.strictEqual(Note.from_index(0).index(), 0);
			assert.strictEqual(Note.from_index(1).index(), 1);
			assert.strictEqual(Note.from_index(2).index(), 2);
			assert.strictEqual(Note.from_index(4).index(), 4);
			assert.strictEqual(Note.from_index(8).index(), 8);

			assert.strictEqual(Note.from_index(11).index(), 11);
			assert.strictEqual(Note.from_index(12).index(), 12);
			assert.strictEqual(Note.from_index(13).index(), 13);
		});
	});
	describe("midi number computation", () =>
	{
		it("should be the inverse of Note.from_midi_number()", () =>
		{
			assert.strictEqual(Note.from_midi_number(0).midi_number(), 0);
			assert.strictEqual(Note.from_midi_number(13).midi_number(), 13);
			assert.strictEqual(Note.from_midi_number(-13).midi_number(), -13);
		});
	});
	describe("frequency computation", () =>
	{
		it("should be the (rough) inverse of Note.from_frequency()", () =>
		{
			assert.strictEqual(A4.frequency(), 440);
		});
	});
	describe("accidental/natural indication", () =>
	{
		it ("should indicate naturals", () =>
		{
			assert.isFalse(A4.is_accidental());
			assert.isTrue(A4.is_natural());
		});
		it ("should indicate accidentals", () =>
		{
			assert.isTrue(A4_sharp.is_accidental());
			assert.isFalse(A4_sharp.is_natural());

			assert.isTrue(A4_flat.is_accidental());
			assert.isFalse(A4_flat.is_natural());
		});
	});
	describe("Conversion to string", () =>
	{
		it("should be the inverse of Note.from_string()", () =>
		{
			assert.strictEqual(Note.from_string("A").to_string(), "A4");
			assert.strictEqual(Note.from_string("A#").to_string(), "A#4");
			assert.strictEqual(Note.from_string("Ab").to_string(), "Ab4");
			assert.strictEqual(Note.from_string("A4").to_string(), "A4");
			assert.strictEqual(Note.from_string("A#4").to_string(), "A#4");
			assert.strictEqual(Note.from_string("Ab4").to_string(), "Ab4");
			assert.strictEqual(Note.from_string("A123").to_string(), "A123");
			assert.strictEqual(Note.from_string("A#123").to_string(), "A#123");
			assert.strictEqual(Note.from_string("Ab123").to_string(), "Ab123");
		});
	});
});
describe("NoteIndex method container", () =>
{
	describe("frequency conversions", () =>
	{
		it("should convert indices to frequencies", () =>
		{
			assert.strictEqual(NoteIndex.to_frequency(0), MNU.A4_frequency);
		});
		it("should convert frequencies to indices", () =>
		{
			assert.strictEqual(NoteIndex.from_frequency(MNU.A4_frequency), 0);
		});
	});
	describe("pitch class deduction", () =>
	{
		it("should operate across octaves", () =>
		{
			assert.strictEqual(NoteIndex.to_pitch_class(0), PitchClass.A);
			assert.strictEqual(NoteIndex.to_pitch_class(12), PitchClass.A);
			assert.strictEqual(NoteIndex.to_pitch_class(-12), PitchClass.A);

			assert.strictEqual(NoteIndex.to_pitch_class(3), PitchClass.C);
			assert.strictEqual(NoteIndex.to_pitch_class(15), PitchClass.C);
			assert.strictEqual(NoteIndex.to_pitch_class(-9), PitchClass.C);
		});
	});
	describe("octave deduction", () =>
	{
		it("should transition octaves at C", () =>
		{
			assert.strictEqual(NoteIndex.to_octave(1), 4);
			assert.strictEqual(NoteIndex.to_octave(2), 4);
			assert.strictEqual(NoteIndex.to_octave(3), 5);
			assert.strictEqual(NoteIndex.to_octave(4), 5);

			assert.strictEqual(NoteIndex.to_octave(-11), 3);
			assert.strictEqual(NoteIndex.to_octave(-10), 3);
			assert.strictEqual(NoteIndex.to_octave(-9), 4);
			assert.strictEqual(NoteIndex.to_octave(-8), 4);
		});
	});
	describe("accidental indication", () =>
	{
		it("should operate across octaves", () =>
		{
			assert(!NoteIndex.is_accidental(0));
			assert( NoteIndex.is_accidental(1));
			assert(!NoteIndex.is_accidental(2));
			assert(!NoteIndex.is_accidental(3));
			assert( NoteIndex.is_accidental(4));
			assert(!NoteIndex.is_accidental(5));
			assert( NoteIndex.is_accidental(6));
			assert(!NoteIndex.is_accidental(7));
			assert(!NoteIndex.is_accidental(8));
			assert( NoteIndex.is_accidental(9));
			assert(!NoteIndex.is_accidental(10));
			assert( NoteIndex.is_accidental(11));
			assert(!NoteIndex.is_accidental(12));

			assert(!NoteIndex.is_accidental(-12));
			assert( NoteIndex.is_accidental(-11));
			assert(!NoteIndex.is_accidental(-10));
			assert(!NoteIndex.is_accidental(-9));
			assert( NoteIndex.is_accidental(-8));
			assert(!NoteIndex.is_accidental(-7));
			assert( NoteIndex.is_accidental(-6));
			assert(!NoteIndex.is_accidental(-5));
			assert(!NoteIndex.is_accidental(-4));
			assert( NoteIndex.is_accidental(-3));
			assert(!NoteIndex.is_accidental(-2));
			assert( NoteIndex.is_accidental(-1));
			assert(!NoteIndex.is_accidental(0));
		});
	});
});
