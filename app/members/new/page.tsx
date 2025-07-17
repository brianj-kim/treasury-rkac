import PageHeader from '@/components/page-header';
import React from 'react';
import MemberForm from '../_components/member-form';

const NewMemberPage = () => {
  return (
    <section className='py-24'>
      <div className="container max-w-4xl ">
        <PageHeader >New Member</PageHeader>
        <MemberForm />
      </div>
    </section>
  );
}

export default NewMemberPage;