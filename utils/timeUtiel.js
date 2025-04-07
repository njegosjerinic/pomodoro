export function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${
      minutes < 10 ? "0" : ""
    }${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  }