import React from 'react';

interface DeleteItineraryButtonProps {\n  itineraryId: string;\n}

const DeleteItineraryButton: React.FC<DeleteItineraryButtonProps> = ({ itineraryId }) => {\n  const handleDelete = async () => {\n    console.log(\"Deleting itinerary with ID:\", itineraryId);\n  };\n\n  return (\n    <button onClick={handleDelete}>Delete Itinerary</button>\n  );\n};\n\nexport default DeleteItineraryButton;