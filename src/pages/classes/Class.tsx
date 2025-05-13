import ClassCard from "../../components/class/ClassCard";
import { classes } from "../../data/data";

function Class() {
  return (
    <div className="Class">
      <ClassCard classes={classes} />
    </div>
  );
}

export default Class;
