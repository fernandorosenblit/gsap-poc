## Add keyframes to each frame of the video

### Download framework [ffmpeg](https://evermeet.cx/ffmpeg/)

### Run in the terminal

```
ffmpeg -i input.mp4 -vf scale=960:-1 -movflags faststart -vcodec libx264 -crf 20 -g 1 -pix_fmt tuv420p output.mp4
```
