# TEMPORARY placeholder photography

Every image in this folder was pulled from the MMP TECHNOLOGY website
(https://mmptechnology.com/, the global sibling brand for the same technology)
as a stand-in so the home page can be reviewed with real component photography.
They are not INFINI's assets and are not cleared for publication.

**Replace all of them with INFINI's own photography before anything deploys
to infini.co.in**, then delete this folder. The home page reads its images from
`pages/home` in Firestore (`gallery.items[].src`, `technology.images[].src`), so
the swap is a media-library upload plus an admin edit, not a code change; the
in-code fallbacks in `components/sections/home/galleryPlaceholders.ts` are the
only references to these files.
