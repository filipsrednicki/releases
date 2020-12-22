import React, { useState } from "react";

const ReadMore = ({ description, maxLength }) => {
  const [readMore, setReadMore] = useState(false);

  return (
    <p>
      {description.length > maxLength && !readMore ? (
        <>
          {description.substring(0, maxLength) + "..."}
          <span className="readmore-btn" onClick={() => setReadMore(true)}>
            Read more
          </span>
        </>
      ) : (
        <>
          {description}
          {readMore && (
            <span className="readmore-btn" onClick={() => setReadMore(false)}>
              Show less
            </span>
          )}
        </>
      )}
    </p>
  );
};

export default ReadMore;