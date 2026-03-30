//src\components\login\SplashHero.jsx
import welcomeImg from "@assets/welcome.png";
import vectorLine from "@assets/Vectorline.png";
import smartFoodImg from "@assets/Smart Food. Smart Access..png";

const SplashHero = () => {
  return (
    <section
      style={{
        width: "100%",
        paddingLeft: "22.8%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "clamp(0.3rem, 0.8vh, 0.6rem)",
      }}
    >
      <img
        src={welcomeImg}
        alt="Welcome to Mukand Limited"
        style={{ width: "clamp(140px, 30vw, 280px)", height: "auto" }}
      />
      <img
        src={vectorLine}
        alt=""
        style={{ width: "clamp(200px, 60vw, 680px)", height: "auto" }} //
      />
      <img
        src={smartFoodImg}
        alt="Smart Food. Smart Access."
        style={{ width: "clamp(260px, 49vw, 600px)", height: "auto" }}
      />
    </section>
  );
};

export default SplashHero;
