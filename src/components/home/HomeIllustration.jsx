// src/components/home/HomeIllustration.jsx
import homeMobIllustration from "@assets/newhome.svg";

const HomeIllustration = () => {
  return (
    <div
      style={{
        position: "absolute",
        top: "clamp(14vh, 17vh, 20vh)",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 5,
        width: "clamp(500px, 70vw, 850px)",
        height: "auto",
      }}
    >
      <img
        src={homeMobIllustration}
        alt="Chef Illustration"
        style={{
          width: "100%",
          height: "auto",
          display: "block",
        }}
      />
    </div>
  );
};

export default HomeIllustration;
