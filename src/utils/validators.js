export const validStatusTransitions = {
  'New': ['Contacted'],
  'Contacted': ['Quote Sent', 'Closed Lost'],
  'Quote Sent': ['Interested', 'Closed Lost'],
  'Interested': ['Closed Won', 'Closed Lost'],
  'Closed Won': [],
  'Closed Lost': []
};