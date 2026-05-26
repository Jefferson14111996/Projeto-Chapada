import { useEffect } from "react";
import { seedOwnership } from "./ownershipStore";

export function useSeedOwnership() {
  useEffect(() => {
    seedOwnership();
  }, []);
}
