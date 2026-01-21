export const mapDBtoAlbumModel = ({ id, ...restData }) => ({
  album: {
    id,
    ...restData,
  },
});

export const mapDBtoSongsModel = ({
  album_id,
  created_at,
  updated_at,
  ...restData
}) => ({
  ...restData,
  albumId: album_id,
  createdAt: created_at,
  updatedAt: updated_at,
});
