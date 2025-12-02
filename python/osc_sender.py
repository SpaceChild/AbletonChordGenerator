#!/usr/bin/env python3

import sys
import json
from pythonosc import udp_client
from clip_creator import create_clip_with_notes
from config import ABLETON_HOST, ABLETON_PORT

def send_to_ableton(data):
    """
    Main entry point for sending MIDI data to Ableton
    Supports both single clip and dual clip generation

    Args:
        data: Dictionary containing either:
            Single clip mode:
            - notes: List of note dicts (pitch, start_time, duration, velocity)
            - track: Track index (int)
            - slot: Clip slot index (int)
            - clipLength: Length in bars (int)

            Dual clip mode:
            - clip1: Dictionary with notes, track, slot, clipLength
            - clip2: Dictionary with notes, track, slot, clipLength

    Returns:
        dict: Result with success status and message
    """
    try:
        # Create OSC client
        client = udp_client.SimpleUDPClient(ABLETON_HOST, ABLETON_PORT)

        print(f"Connecting to Ableton at {ABLETON_HOST}:{ABLETON_PORT}", file=sys.stderr)

        # Check if this is dual clip mode
        if 'clip1' in data and 'clip2' in data:
            print("Dual clip mode detected", file=sys.stderr)

            # Create first clip (original)
            print(f"Creating clip 1 (original)...", file=sys.stderr)
            success1, slot1 = create_clip_with_notes(
                client,
                track_index=data['clip1']['track'],
                clip_slot_index=data['clip1']['slot'],
                clip_length=data['clip1']['clipLength'],
                notes=data['clip1']['notes']
            )

            if not success1:
                return {
                    'success': False,
                    'error': 'Failed to create first clip in Ableton'
                }

            # Create second clip (complementary)
            print(f"Creating clip 2 (complementary)...", file=sys.stderr)
            success2, slot2 = create_clip_with_notes(
                client,
                track_index=data['clip2']['track'],
                clip_slot_index=data['clip2']['slot'],
                clip_length=data['clip2']['clipLength'],
                notes=data['clip2']['notes']
            )

            if not success2:
                return {
                    'success': False,
                    'error': 'Failed to create second clip in Ableton'
                }

            return {
                'success': True,
                'message': f'Created 2 clips: Track {data["clip1"]["track"]} slots {slot1}, {slot2} with {len(data["clip1"]["notes"])} and {len(data["clip2"]["notes"])} notes'
            }

        else:
            # Single clip mode (backward compatibility)
            print("Single clip mode", file=sys.stderr)
            success, clip_slot_index = create_clip_with_notes(
                client,
                track_index=data['track'],
                clip_slot_index=data['slot'],
                clip_length=data['clipLength'],
                notes=data['notes']
            )

            if success:
                return {
                    'success': True,
                    'message': f'Created clip on track {data["track"]}, slot {clip_slot_index} with {len(data["notes"])} notes'
                }
            else:
                return {
                    'success': False,
                    'error': 'Failed to create clip in Ableton'
                }

    except Exception as e:
        print(f"Exception in send_to_ableton: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc(file=sys.stderr)
        return {
            'success': False,
            'error': str(e)
        }


if __name__ == '__main__':
    try:
        # Read JSON from stdin
        input_json = sys.stdin.read()
        print(f"Received input: {len(input_json)} chars", file=sys.stderr)

        input_data = json.loads(input_json)
        print(f"Parsed data: track={input_data.get('track')}, notes={len(input_data.get('notes', []))}", file=sys.stderr)

        # Send to Ableton
        result = send_to_ableton(input_data)

        # Output result as JSON to stdout
        print(json.dumps(result))
        sys.stdout.flush()

    except Exception as e:
        print(f"Fatal error: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc(file=sys.stderr)

        # Return error as JSON
        print(json.dumps({
            'success': False,
            'error': str(e)
        }))
        sys.stdout.flush()
        sys.exit(1)
