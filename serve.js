import { evaluateBids } from "./evaluation.js";

Deno.serve(async (_req) => {

  if(_req.method === 'GET'){
    const evaluation_id = _req.url.split('/').pop()
    const kv = await Deno.openKv();
    const evaluation =  await kv.get(["evaluations", evaluation_id]);
      return Response.json(evaluation.value, { status: 200 });
  }

  if (_req.method !== 'POST' || !_req.headers.has('content-type') ||
        !_req.headers.get('content-type').startsWith('multipart/form-data')) {
      return new Response('Unsupported request method or content type', { status: 400 });
  }

    try {

      const formData = await _req.formData()

      // Extract uploaded file
      if (!formData.has('file')) {
        return new Response('Missing file in upload', { status: 400 });
      }

      const file = formData.get('file');

      console.log(Deno.File)
      // // Check for valid file object
      // if (!(file instanceof Deno.File)) {
      //   return new Response('Invalid uploaded file', { status: 400 });
      // }

      // Handle the uploaded file stream here (see step 2)
      const evaluation_id = evaluateBids(file);

      return Response.json({id:evaluation_id}, { status: 200 });
    } catch (err) {
      console.error(err);
      return new Response('Internal server error', { status: 500 });
    }

});
