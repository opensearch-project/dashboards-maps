import React, { forwardRef, useRef, useImperativeHandle } from 'react';

const MapsLegend = forwardRef(function MapsLegend(props, ref) {
  const divRef = useRef(null);

  useImperativeHandle(
    ref,
    () => {
      return {
        scrollToBottom() {
          const node = divRef.current;
          node.scrollTop = node.scrollHeight;
        },
      };
    },
    []
  );

  return (
    <div className="CommentList" ref={divRef}>
      {comments}
    </div>
  );
});

export { MapsLegend };
