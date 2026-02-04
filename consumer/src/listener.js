/* eslint-disable no-console */
export class Listener {
  constructor(songsService, mailSender) {
    this._songsService = songsService;
    this._mailSender = mailSender;

    this.listen = this.listen.bind(this);
  }

  async listen(message) {
    try {
      const { playlistId, targetEmail } = JSON.parse(
        message.content.toString(),
      );

      const songs = await this._songsService.getSongsFromPlaylist(playlistId);

      const playlist = {
        id: songs[0]?.playlist_id,
        name: songs[0]?.playlist_name,
        songs: [],
      };
      songs.forEach((song) => {
        if (song.song_id) {
          playlist.songs.push({
            id: song.song_id,
            title: song.title,
            performer: song.performer,
          });
        }
      });

      const result = await this._mailSender.sendEmail(
        targetEmail,
        JSON.stringify({ playlist }),
      );
      console.log(result);
    } catch (error) {
      console.error("Gagal mengirim email:", error);
    }
  }
}
