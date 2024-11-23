import { H2 } from "@/components/typography";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { User } from "@/lib/types";

export default function ProfileInfo({ dataProfile }: { dataProfile: User }) {
  return (
    <div className="flex-1 flex flex-col gap-5">
      <H2 className="text-primary">{dataProfile.username}'s profile</H2>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="font-bold">Username</TableCell>
            <TableCell className="text-right">
              {dataProfile.username || ""}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-bold">Firstname</TableCell>
            <TableCell className="text-right">
              {dataProfile.firstName || ""}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-bold">Lastname</TableCell>
            <TableCell className="text-right">
              {dataProfile.lastName || ""}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-bold">Email</TableCell>
            <TableCell className="text-right">
              {dataProfile.email || ""}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-bold">Role</TableCell>
            <TableCell className="text-right">{dataProfile.role}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-bold">Created</TableCell>
            <TableCell className="text-right">
              {formatDate(dataProfile.createdAt || "")}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
