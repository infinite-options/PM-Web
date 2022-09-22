import { height } from "@mui/system";

export const Input = ({ name, value, onChange, errors }) => {
    return (
      <>
        <input style={{width:"40vw", height:"5vh", columnGap:"5px"}}type="text" placeholder={name} value={value} onChange={onChange} />
        {errors.length > 0
          ? errors.map((e) => (
              <p style={{ fontSize: "9px", color: "red" }}>{e}</p>
            ))
          : null}
      </>
    );
  };