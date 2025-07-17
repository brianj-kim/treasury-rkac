import db from '@/db/db';
import React from 'react';

import PageHeader from '@/components/page-header';
import MemberForm from '../../_components/member-form';

const EditMemberPage = async ({
  params: { id }
}: {params: { id: string }}) => {
  const member = await db.members.findUnique({ where: { id: parseInt(id) }})

  return (
    <section className='py-24'>
      <div className="container max-w-4xl ">
        <PageHeader >Edit Member</PageHeader>
        <MemberForm member={member}/>
      </div>
    </section>
  );
}

export default EditMemberPage;