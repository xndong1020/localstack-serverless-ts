export const handler = async (event: any) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Works12!",
        input: event,
      },
      null,
      2
    ),
  };
};
