import axios from "axios";

export const filterPaginationData = async ({
  create_new_arr = false,
  state,
  data,
  page,
  countRoute,
  data_to_send = {},
}) => {
  let obj;

  // If we already have data, moving to next page
  if (state != null && !create_new_arr) {
    obj = { ...state, results: [...state.results, ...data], page: page };
  } else {
    // Creating the first time
    await axios
      .post(import.meta.env.VITE_BASE_URL + countRoute, data_to_send)
      .then(({ data: { totalDocs } }) => {
        obj = { results: data, page: 1, totalDocs };
      })
      .catch((err) => console.log(err));
  }
  return obj;
};
// state - existing data
// data - data to be attached
