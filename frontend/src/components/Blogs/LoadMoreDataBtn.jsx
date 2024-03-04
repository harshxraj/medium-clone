import React from "react";

const LoadMoreDataBtn = ({ state, fetchData }) => {
  if (state != null && state.totalDocs > state.results.length) {
    return (
      <button
        onClick={() => fetchData({ page: state.page + 1 })}
        className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2"
      >
        Load More
      </button>
    );
  }
  return null; // <-- Add a return statement for cases where the condition is not met
};

export default LoadMoreDataBtn;
