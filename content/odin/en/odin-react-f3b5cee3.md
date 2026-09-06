# Project: CV application

Build a small application where someone enters information and generates a résumé view. Practice components, props, state, and controlled forms. Use fictional information in the public demo; publishing a real phone number is not necessary to demonstrate the feature.

## Complete requirements

1. Create a React project. Ruta's submitted application uses Next.js App Router; a Vite sandbox remains useful for isolated component practice.
2. Plan components for general information (name, email, phone), education (school, qualification, study dates), and practical experience (company, position, responsibilities, start and end dates).
3. Include edit and submit controls for each section or the entire CV. Submitting shows field values as HTML content. Editing restores inputs containing the displayed values. Users must be able to edit and resubmit without losing information.
4. Put reusable components in `src/components` and CSS in a styles directory or colocated CSS Modules. Import each stylesheet appropriately.
5. Publish the repository and a working deployment. Include both links and a README explaining state ownership and component boundaries.

## Start with one section

Decide which component owns the data and which renders its presentation. Keep the editing mode separate from field values: a boolean describes the current view, while an object describes the person's information. Returning to editing must not create empty inputs.

```jsx
const [details, setDetails] = useState({ name: "", email: "", phone: "" });
const [isEditing, setIsEditing] = useState(true);

function save(event) {
  event.preventDefault();
  setIsEditing(false);
}

function changeName(event) {
  const name = event.target.value;
  setDetails(previous => ({ ...previous, name }));
}
```

This fragment is not a completed project. Connect it to labels, inputs, form submission, and a read-only view. Import the hooks and keep events inside a Client Component when using Next.js. Retain StrictMode: duplicate development logs can expose impurity and are not a reason to disable its checks.

## Next.js deployment replacement

The original recommends [Netlify](https://docs.netlify.com/), [Vercel](https://www.vercel.com/docs), or [Cloudflare Pages](https://developers.cloudflare.com/pages) for Vite's static output: import a GitHub repository, select a deployment branch, and publish `dist`. The [Vite deployment guide](https://vitejs.dev/guide/static-deploy.html) documents that alternative.

Ruta replaces that step with a Next.js deployment on a compatible Node host such as Railway. Run `npm run build` and `npm run start` locally. Connect the repository in the provider, configure build and start commands, and open its assigned HTTPS domain. Do not publish a Vite `dist` directory or rewrite every route to `/index.html`; Next.js handles these routes itself.

Pages use `app/.../page.tsx`; shared `layout.tsx` files render nested content through `children`. A future `/cv/[id]` page would read asynchronous parameters, validate the identifier, use `not-found.tsx` for an absent CV, and `error.tsx` for unexpected rendering failures. Ordinary navigation uses `Link` from `next/link`. Authentication and database storage are not required for this first project, so do not delay the state-and-form exercise while implementing them.

## Submission checks

- Fill every field, submit, edit again, and verify preserved values.
- Repeat for education and employment, including long responsibilities and date ranges.
- Open the production URL directly, refresh it, and navigate with keyboard on narrow and wide screens.
- Check the console for controlled-input and key warnings.
- Document that refresh may reset data; persistence is not a requirement here.
