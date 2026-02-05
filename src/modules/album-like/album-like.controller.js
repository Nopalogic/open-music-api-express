import { AlbumLikeService } from "./album-like.service.js";
import { UserService } from "../user/user.service.js";
import { AlbumService } from "../album/album.service.js";

export class AlbumLikeController {
  constructor() {
    this.albumLikeService = new AlbumLikeService();
    this.albumService = new AlbumService();
    this.userService = new UserService();
  }

  addLike = async (req, res, next) => {
    const { id: albumId } = req.params;
    const { id: userId } = req.user;

    try {
      await this.userService.getUserById({ userId });

      await this.albumService.findAlbum(albumId);

      await this.albumLikeService.addLike({ userId, albumId });

      res.status(201).json({
        status: "success",
        message: "Like berhasil ditambahkan",
      });
    } catch (error) {
      next(error);
    }
  };

  deleteLike = async (req, res, next) => {
    const { id: albumId } = req.params;
    const { id: userId } = req.user;

    try {
      await this.albumService.findAlbum(albumId);

      await this.albumLikeService.removeLike({ userId, albumId });

      res.status(200).json({
        status: "success",
        message: "Like berhasil dihapus",
      });
    } catch (error) {
      next(error);
    }
  };

  getCountLikes = async (req, res, next) => {
    const { id: albumId } = req.params;
    try {
      await this.albumService.findAlbum(albumId);

      const { count: likeCount, source } =
        await this.albumLikeService.getCountLikes(albumId);

      if (source === "cache") {
        res.setHeader("X-Data-Source", "cache");
      }

      res.status(200).json({
        status: "success",
        message: "Jumlah like berhasil didapatkan",
        data: {
          likes: likeCount,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
