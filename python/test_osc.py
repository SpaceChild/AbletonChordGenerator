#!/usr/bin/env python3
"""
Test script to verify AbletonOSC connection
"""

import time
from pythonosc import udp_client

# Connect to AbletonOSC
client = udp_client.SimpleUDPClient('127.0.0.1', 11000)

print("Testing AbletonOSC connection...")
print("Sending test commands...")

# Test 1: Get tempo
print("\n1. Testing tempo command...")
client.send_message("/live/song/get/tempo", [])
time.sleep(0.1)

# Test 2: Set tempo
print("2. Setting tempo to 120 BPM...")
client.send_message("/live/song/set/tempo", 120)
time.sleep(0.1)

# Test 3: Get track names
print("3. Getting track count...")
client.send_message("/live/song/get/num_tracks", [])
time.sleep(0.1)

# Test 4: Try to create a clip
print("4. Attempting to create clip on track 0, slot 0, length 4 bars...")
client.send_message("/live/clip_slot/create_clip", [0, 0, 4])
time.sleep(0.5)

print("\nTest complete! Check Ableton Live to see if anything happened.")
print("If you see a clip in Track 1, Slot 1, then AbletonOSC is working!")
