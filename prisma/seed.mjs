import { PrismaClient, WatchMethod, CaptionTone } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await hash("demo1234", 12);

  const user = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {
      name: "홍길동",
      passwordHash,
    },
    create: {
      email: "demo@example.com",
      name: "홍길동",
      passwordHash,
    },
  });

  const movie = await prisma.movie.upsert({
    where: { externalMovieId: "tmdb_12345" },
    update: {
      title: "듄: 파트 2",
      originalTitle: "Dune: Part Two",
      releaseDate: new Date("2024-02-28"),
      posterUrl: "https://image.tmdb.org/t/p/w500/example.jpg",
      overview: "사막 행성을 배경으로 펼쳐지는 서사와 인물의 선택을 다룬 영화.",
      runtime: 166,
      genres: ["SF", "모험", "드라마"],
    },
    create: {
      externalMovieId: "tmdb_12345",
      title: "듄: 파트 2",
      originalTitle: "Dune: Part Two",
      releaseDate: new Date("2024-02-28"),
      posterUrl: "https://image.tmdb.org/t/p/w500/example.jpg",
      overview: "사막 행성을 배경으로 펼쳐지는 서사와 인물의 선택을 다룬 영화.",
      runtime: 166,
      genres: ["SF", "모험", "드라마"],
    },
  });

  const watchedAt = new Date("2026-03-31T19:30:00+09:00");

  const existingLog = await prisma.movieLog.findFirst({
    where: {
      userId: user.id,
      movieId: movie.id,
      watchedAt,
    },
  });

  const movieLog =
    existingLog ||
    (await prisma.movieLog.create({
      data: {
        userId: user.id,
        movieId: movie.id,
        watchedAt,
        watchPlace: "메가박스 코엑스",
        watchMethod: WatchMethod.THEATER,
        companions: "친구 1명",
        rating: 4.5,
        shortReview: "영상과 사운드가 압도적이었고, 엔딩의 여운이 길게 남았다.",
        isSpoiler: false,
      },
    }));

  await prisma.generatedCaption.upsert({
    where: {
      movieLogId_versionNo: {
        movieLogId: movieLog.id,
        versionNo: 1,
      },
    },
    update: {
      tone: CaptionTone.EMOTIONAL,
      captionText:
        "오늘 본 영화의 여운이 아직도 남아 있다. 거대한 세계관 속에서도 결국 마음에 남는 건 인물의 선택이었다.",
      hashtagsText: "#영화기록 #듄파트2 #영화리뷰",
    },
    create: {
      movieLogId: movieLog.id,
      tone: CaptionTone.EMOTIONAL,
      captionText:
        "오늘 본 영화의 여운이 아직도 남아 있다. 거대한 세계관 속에서도 결국 마음에 남는 건 인물의 선택이었다.",
      hashtagsText: "#영화기록 #듄파트2 #영화리뷰",
      versionNo: 1,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
