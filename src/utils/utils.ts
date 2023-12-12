export const formatDate = (date: string): string => {
  return Intl.DateTimeFormat("en-EG", {
    dateStyle: "medium",
  }).format(new Date(date));
};
