[![Build Status](https://travis-ci.org/rharel/js-music-note-utils.svg?branch=master)](https://travis-ci.org/rharel/js-music-note-utils) ![coverage](coverage/badge.svg)

# Musical Note Utilities

...is a little JavaScript library aiming to help you model and manipulate musical notes. 

## Installation

Either `require('@rharel/music-note-utils')` or include in the browser with `<script src="music_note_utils.js"></script>`.

## Usage

```javascript
var MusicNoteUtilities = require('@rharel/music_note_utils');
```
or if in-browser:
```javascript
window.MusicNoteUtilities;
```
### Tuning

By default, the library operates with the assumption that the frequency of `A4` is `440Hz`, but this can be changed:

```javascript
MusicNoteUtilities.A4_frequency = 442;  // default is 440
```

### Pitch classes

The `PitchClass` enumeration provides useful information about each pitch class `A-G`, and is also a property of the `Note` object.

```javascript
var PitchClass = MusicNoteUtilities.PitchClass;

// The class' index (0-6, corresponding to A-G).
PitchClass.A.index;  // 0

// The class' index as a key in an octave
// (an octave has 12 keys).
PitchClass.A.index_in_octave;  // 9

// The class' letter symbol
PitchClass.A.letter;  // "A"

// Gets the class with the specified index.
var A = PitchClass.with_index(0);  // PitchClass.A
```

### Accidentals

The `Accidental` enumeration provides useful information about possible accidental modifications of a note, and is also a property of the `Note` object.

```javascript
var Accidental = MusicNoteUtilities.Accidental;

// The accidental's implied semi-tone shift.
Accidental.None.shift;  // 0
Accidental.Sharp.shift;  // 1
Accidental.Flat.shift;  // -1

// The accidental's symbol.
Accidental.None.symbol;  // ""
Accidental.Sharp.symbol;  // "#"
Accidental.Flat.symbol;  // "b"
```

### Notes

#### Construction

Note objects can be created by multiple ways:

```javascript
var Note = MusicNoteUtilities.Note;

// From strings:
var As5 = Note.from_string("A#5");

// From frequencies:
var A4 = Note.from_frequency(440);

// From indices relative to A4:
var A3 = Note.from_index(-12);

// From MIDI numbers:
var A4 = Note.from_midi_number(69);

// Explicitly:
var Cb5 = Note.C(Accidental.Flat, 5);

// Even more explicitly:
var Db5 = new Note(PitchClass.D, Accidental.Flat, 5);
```

#### Query and manipulation

The following properties and methods are available on a `Note` object:

```javascript
var Ab4 = Note.from_string("Ab4");
var Ab5 = Note.from_string("Ab5");

// Descriptors:
Ab4.pitch_class;  // PitchClass.A
Ab4.accidental;  // Accidental.Flat
Ab4.octave;  // 4
Ab4.is_accidental();  // true
Ab4.is_natural();  // false
Ab4.index();  // -1
Ab4.C4_index();  // 8 (relative to C4 instead of A4)
Ab4.midi_number();  // 68
Ab4.frequency();  // ~415 (in Hz)

// As a string:
Ab4.to_string();  // "Ab4"

// Cloning:
var Ab4_clone = Ab4.clone();  // a separate note object

// Equality
Ab4.equals(Ab4);  // true
Ab4.equals(Ab5);  // false

// Transposition:
Ab4.transpose(12).equals(Ab5);  // true

// Variants:
var A4 = Ab4.natural();
var As4 = Ab4.sharp();
Ab4.equals(As4.flat());  // true
```
## License

This software is licensed under the **MIT License**. See the [license](LICENSE.txt) file for more information.
