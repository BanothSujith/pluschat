export const sendresponse = (res, statusCode, StatusMessage, Message, data = {} ) =>{
    if(!data) return res.status(statusCode)
      .json({ Status: StatusMessage, Message: Message }).end();

     return res.status(statusCode).json({ "Status": StatusMessage, "Message":Message, "Data": data });
     
};