import librosa
import numpy as np
import sys

def dtw_shift_param(sig1, sig2, sr):
  n_fft = int((sr / 10.) * 2.)
  hop_length = int(n_fft / 2.)

  sig1_chroma = librosa.feature.chroma_stft(y=sig1, sr=sr, n_fft=n_fft, hop_length=hop_length)
  sig2_chroma = librosa.feature.chroma_stft(y=sig2, sr=sr, n_fft=n_fft, hop_length=hop_length)

  D, wp = librosa.sequence.dtw(X=sig1_chroma, Y=sig2_chroma, metric="euclidean")
  avg_cost = np.mean(D[wp[:, 0], wp[:, 1]])

  del sig1_chroma, sig2_chroma, D

  return wp, hop_length, avg_cost

def pseudo_hist_time_shift(wp, sr, hop_length):
  time_diffs = wp[:, 1] - wp[:, 0]
  time_diffs_sec = time_diffs * hop_length / sr
  tdiff_sec, tdiff_counts = np.unique(time_diffs_sec, return_counts=True)

  max_idx = np.argmax(tdiff_counts)
  mode_time_shift = tdiff_sec[max_idx]

  del time_diffs, time_diffs_sec, tdiff_sec, tdiff_counts

  return mode_time_shift

def find_sync_points_dtw(audio_paths, similarity_threshold=1400):
  offsets = [0]

  if not audio_paths:
    return offsets

  ref_sig, sr = librosa.load(audio_paths[0], sr=None)

  for path in audio_paths[1:]:
    sig, _ = librosa.load(path, sr=sr)

    wp, hop_length, avg_cost = dtw_shift_param(ref_sig, sig, sr)

    if avg_cost > similarity_threshold:
      del ref_sig, sig, wp

      return False

    mode_time_shift = pseudo_hist_time_shift(wp, sr, hop_length)
    offsets.append(mode_time_shift)

    del sig, wp

  del ref_sig

  return offsets

if __name__ == "__main__":
  if len(sys.argv) < 2:
    sys.exit(1)

  audio_file_paths = sys.argv[1:]

  offsets = find_sync_points_dtw(audio_file_paths)
  print(offsets)