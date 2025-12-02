import time
import sys

def ensure_track_exists(client, track_index):
    """
    Ensures the track exists, creates it if necessary

    Note: OSC doesn't provide direct feedback, so this is best-effort
    """
    try:
        # Try to set the track name
        # If track doesn't exist, this will fail silently in most cases
        client.send_message(f"/live/track/{track_index}/set/name", "Generated Chords")
        time.sleep(0.1)
    except Exception as e:
        print(f"Note: Could not set track name: {e}", file=sys.stderr)


def create_clip_with_notes(client, track_index, clip_slot_index, clip_length, notes):
    """
    Creates a MIDI clip in Ableton and populates it with notes

    Args:
        client: OSC UDP client
        track_index: Track number (0-based)
        clip_slot_index: Clip slot number (0-based)
        clip_length: Length in bars
        notes: List of note dictionaries with pitch, start_time, duration, velocity

    Returns:
        tuple: (success: bool, clip_slot_index: int)
    """
    try:
        # 1. Ensure track exists
        ensure_track_exists(client, track_index)

        # 2. Delete existing clip if present
        print(f"Deleting existing clip on track {track_index}, slot {clip_slot_index}", file=sys.stderr)
        try:
            client.send_message(
                "/live/clip_slot/delete_clip",
                [track_index, clip_slot_index]
            )
            time.sleep(0.2)  # Wait for deletion
        except Exception as e:
            print(f"Note: Could not delete existing clip (may not exist): {e}", file=sys.stderr)

        # 3. Create empty clip using correct AbletonOSC syntax
        print(f"Creating clip on track {track_index}, slot {clip_slot_index}, length {clip_length} bars", file=sys.stderr)
        client.send_message(
            "/live/clip_slot/create_clip",
            [track_index, clip_slot_index, clip_length]
        )
        time.sleep(0.3)  # Wait for clip creation

        # 4. Add notes to the clip using correct AbletonOSC syntax
        print(f"Adding {len(notes)} notes to clip", file=sys.stderr)
        notes_added = 0
        for i, note in enumerate(notes):
            # Validate note data
            if note.get('pitch') is None:
                print(f"Warning: Skipping note {i} - pitch is None: {note}", file=sys.stderr)
                continue
            if note.get('start_time') is None:
                print(f"Warning: Skipping note {i} - start_time is None: {note}", file=sys.stderr)
                continue
            if note.get('duration') is None:
                print(f"Warning: Skipping note {i} - duration is None: {note}", file=sys.stderr)
                continue
            if note.get('velocity') is None:
                print(f"Warning: Skipping note {i} - velocity is None: {note}", file=sys.stderr)
                continue

            try:
                # AbletonOSC syntax: /live/clip/add/notes track_id, clip_id, pitch, start_time, duration, velocity, mute
                client.send_message(
                    "/live/clip/add/notes",
                    [
                        track_index,
                        clip_slot_index,
                        int(note['pitch']),
                        float(note['start_time']),
                        float(note['duration']),
                        int(note['velocity']),
                        0  # mute (0 = not muted)
                    ]
                )
                notes_added += 1

                # Small delay every 10 notes to avoid overwhelming OSC
                if (notes_added % 10) == 0:
                    time.sleep(0.01)
            except Exception as e:
                print(f"Error adding note {i}: {e} - Note data: {note}", file=sys.stderr)

        time.sleep(0.1)  # Final wait to ensure all notes are registered

        # 5. Set loop region to full clip length
        # Loop start at 0.0, loop end at clip_length * 4 (beats)
        loop_end = clip_length * 4.0
        print(f"Setting loop region: 0.0 to {loop_end} beats", file=sys.stderr)

        try:
            # Set loop start
            client.send_message(
                "/live/clip/set/loop_start",
                [track_index, clip_slot_index, 0.0]
            )
            time.sleep(0.05)

            # Set loop end
            client.send_message(
                "/live/clip/set/loop_end",
                [track_index, clip_slot_index, loop_end]
            )
            time.sleep(0.05)

            # Ensure looping is enabled
            client.send_message(
                "/live/clip/set/looping",
                [track_index, clip_slot_index, 1]
            )
            time.sleep(0.05)
        except Exception as e:
            print(f"Warning: Could not set loop region: {e}", file=sys.stderr)

        print(f"Successfully created clip with {notes_added}/{len(notes)} notes", file=sys.stderr)

        return True, clip_slot_index

    except Exception as e:
        print(f"Error creating clip: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc(file=sys.stderr)
        return False, -1
