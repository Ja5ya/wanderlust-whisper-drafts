
import { useEffect } from "react";

export const useSampleData = () => {
  useEffect(() => {
    // Sample data is now manually inserted in the database
    // This hook is kept for compatibility but no longer generates data
    console.log("Using real database data - sample data hook disabled");
  }, []);
};
