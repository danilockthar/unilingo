import Header from "../src/components/Header";
import VideoURL from "../src/components/VideoURL";

type Props = {
  videos: any[];
};

const Index = ({ videos }: Props) => {
  console.log({ videos }, "THE VIDEOS!");
  return (
    <div>
      <Header />
      <VideoURL videos={videos} />
    </div>
  );
};

export default Index;

export const getServerSideProps = async () => {
  const res = await fetch(`http://localhost:3000/api/videos`);
  const videos = await res.json();

  return { props: { videos: videos.rows } };
};
