import JoditEditor from "jodit-react";
import { useRef, useState, useMemo } from "react";

const JoditWrapper = ({ editNewsletter, gptNewsletter }) => {
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const config = useMemo(
    () => ({
      readonly: false, // all options from https://xdsoft.net/jodit/doc/,
      placeholder: "Start typing...",
      defaultActionOnPaste: "insert_as_html",
      askBeforePasteHTML: false,
    }),
    []
  );
  return (
    <div>
      <JoditEditor
        ref={editor}
        value={gptNewsletter || "this is the newsletter.ok..!"}
        config={config}
        tabIndex={1} // tabIndex of textarea
        //onBlur={(newContent) => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
        onChange={(newContent) => {
          if (newContent) {
            editNewsletter(newContent);
          }
        }}
      />
    </div>
  );
};

export default JoditWrapper;
