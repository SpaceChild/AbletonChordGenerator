#!/usr/bin/env python3

import sys
import json
from pythonosc import udp_client
from clip_creator import create_clip_with_notes
from config import ABLETON_HOST, ABLETON_PORT

def send_to_ableton(data):
    """
    Main entry point for sending MIDI data to Ableton

    Args:
        data: Dictionary containing:
            - notes: List of note dicts (pitch, start_time, duration, velocity)
            - track: Track index (int)
            - slot: Clip slot index (int)
            - clipLength: Length in bars (int)
            - bpm: Tempo (int)

    Returns:
        dict: Result with success status and message
    """
    try:
        # Create OSC client
        client = udp_client.SimpleUDPClient(ABLETON_HOST, ABLETON_PORT)

        print(f"Connecting to Ableton at {ABLETON_HOST}:{ABLETON_PORT}", file=sys.stderr)

        # Set BPM
        print(f"Setting BPM to {data['bpm']}", file=sys.stderr)
        client.send_message("/live/song/set/tempo", float(data['bpm']))

        # Create clip and add notes
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
