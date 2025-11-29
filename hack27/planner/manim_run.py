import subprocess
import tempfile
import os
import shutil

def run_manim_script(manim_code: str, scene_name: str, output_path: str = "static/videos/final.mp4"):
    # Write temporary script
    with tempfile.NamedTemporaryFile(delete=False, suffix=".py", mode="w", encoding="utf-8") as temp_file:
        temp_file.write(manim_code)
        temp_path = temp_file.name

    # Ensure output folder exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    try:
        # FAST RENDER
        cmd = ["manim", "-ql", "--disable_caching", temp_path, scene_name]
        process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        stdout, stderr = process.communicate()

        if process.returncode != 0:
            print("❌ Manim Error:")
            print(stderr)
            return None

        print("✅ Manim Rendered Successfully!")

        # ----------------------
        # FIND final MP4
        # ----------------------
        media_root = os.path.join(os.getcwd(), "media", "videos")

# If no video folder exists → render failed → stop cleanly
        if not os.path.exists(media_root):
            print("❌ ERROR: media/videos folder does not exist. Manim render failed.")
            return None

        subdirs = [os.path.join(media_root, d) for d in os.listdir(media_root) if os.path.isdir(os.path.join(media_root, d))]

        if not subdirs:
            print("❌ ERROR: No subdirectories found in media/videos. Nothing to load.")
            return None

        latest_dir = max(subdirs, key=os.path.getmtime)


        final_video = None
        for root, _, files in os.walk(latest_dir):
            for f in files:
                if f.endswith(".mp4") and scene_name in f:
                    final_video = os.path.join(root, f)

        if not final_video:
            print("❌ ERROR: Could not find rendered video.")
            return None

        # Copy video to static folder
        shutil.copy(final_video, output_path)
        print(f"🎥 Saved final video to: {output_path}")

    finally:
        # Remove temp script
        os.remove(temp_path)

        # REMOVE the entire media folder to prevent memory usage
        media_folder = os.path.join(os.getcwd(), "media")
        if os.path.exists(media_folder):
            shutil.rmtree(media_folder)
            print("🧹 Cleaned Manim media folder to save space")

    return output_path
