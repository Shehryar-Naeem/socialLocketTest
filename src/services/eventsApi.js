const { in200s } = require("helpers");
const { API } = require("./ApiClient");

const getEventsByFromUserId = (userId) =>
  API.get(`events/sent/${userId}`).then((response) => {
    if (in200s(response.status)) {
      return response.data?.result;
    }
    return null;
  });

const getEventsByToUserId = (userId) =>
  API.get(`events/received/${userId}`).then((response) => {
    if (in200s(response.status)) {
      return response.data?.result;
    }
    return null;
  });

const getEventsByToUserIdFromUserId = (toUserId, fromUserId) =>
  API.get(`events/${toUserId}/${fromUserId}`).then((response) => {
    if (in200s(response.status)) {
      return response.data?.result;
    }
    return null;
  });

const createEvent = (data) => API.post(`/events`, data);

const updateEvent = (data) => API.put(`events/:id`, data);

export {
  createEvent,
  getEventsByFromUserId,
  getEventsByToUserId,
  getEventsByToUserIdFromUserId,
  updateEvent,
};
