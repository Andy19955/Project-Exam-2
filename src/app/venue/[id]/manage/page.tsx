import ManageVenueForm from "./ManageVenueForm";

export default async function ManageVenuePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
      <ManageVenueForm id={id} />
    </div>
  );
}
