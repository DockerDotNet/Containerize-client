import { Container } from "@/app/containers/types";

/**
 * Compare two containers based on their public ports.
 * @param a - First container
 * @param b - Second container
 * @returns Negative if a < b, positive if a > b, zero if equal
 */
export const compareContainersByPorts = (a: Container, b: Container): number => {
  // Extract and sort all public ports for container A
  const aPorts = a.Ports?.map((port) => port.PublicPort || 0).sort((x, y) => x - y) || [];
  // Extract and sort all public ports for container B
  const bPorts = b.Ports?.map((port) => port.PublicPort || 0).sort((x, y) => x - y) || [];

  // Compare the lists of public ports
  for (let i = 0; i < Math.min(aPorts.length, bPorts.length); i++) {
    if (aPorts[i] !== bPorts[i]) {
      return aPorts[i] - bPorts[i];
    }
  }

  // If all compared ports are equal, sort by the number of ports
  return aPorts.length - bPorts.length;
};