export const ApiConfig = {
  GET_STATES: `${process.env.NEXT_PUBLIC_API_URL}states`,
  GET_DISTRICT: `${process.env.NEXT_PUBLIC_API_URL}districts`,
  GET_POLICE: `${process.env.NEXT_PUBLIC_API_URL}police-stations`,
  GET_POST_OFFICE: `${process.env.NEXT_PUBLIC_API_URL}post-offices`,
  GET_MUNICIPALITY: `${process.env.NEXT_PUBLIC_API_URL}municipalities`,
  GET_APPLICATION_TYPE: `${process.env.NEXT_PUBLIC_API_URL}application-types`,
  GET_FEES_CATEGORY: `${process.env.NEXT_PUBLIC_API_URL}fees-categories`,
  GET_POLLUTION: `${process.env.NEXT_PUBLIC_API_URL}pollution-types`,
  CREATE_APPLICATION: `${process.env.NEXT_PUBLIC_API_URL}applications`,
  UPDATE_APPLICATION: `${process.env.NEXT_PUBLIC_API_URL}applications`,
};

export default ApiConfig;