import { isVoidedTransactionStatus } from "../../constants/transactions";
import { formatTransactionStatus } from "../../lib/formatters";
import { Badge } from "../ui/badge";

export function TransactionStatusBadge({ status }) {
  return (
    <Badge variant={isVoidedTransactionStatus(status) ? "secondary" : "default"}>
      {formatTransactionStatus(status)}
    </Badge>
  );
}
