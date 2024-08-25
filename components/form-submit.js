"use client";

import { useFormStatus } from 'react-dom';

export default function FormSubmit() {
  const status = useFormStatus();
//  console.log(status);
  if (status.pending) {
    return <p>Creating post...</p>;
  }

  return (
    <>
      <button type="reset">Reset</button>
      <button>Create Post</button>
    </>
  );
}
