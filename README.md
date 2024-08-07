# @untlsn/solid-form
## A simple yet powerful modular library to create forms with solidjs

# Installation
@untlsn/solid-form is provided by [JSR open-source package registry for JavaScript and TypeScript](https://jsr.io/)
```bash
npx jsr i @untlsn/solid-form
yarn dlx jsr i @untlsn/solid-form
pnpm dlx jsr i @untlsn/solid-form
bunx jsr i @untlsn/solid-form
```

@untlsn/solid-form don't require any wrapper or provider to work, so you can just use it out of the box

# How to use

@untlsn/solid-form is based on modularity, transparency and freedom, so at first time it can look too complex with a lot of boilerplate, but after some time it will feel like simple wrapper over solid primitives as it is.
I highly suggest to use wildcard with this package. Recommended wildcard is sf
```js
import * as sf from '@untlsn/solid-form';
```

## Simple usage:
This is example of simple usage of form without any advanced modules
```tsx
type FormInputs = { login: string, password: string }
const form = sf.createForm<FormInputs>();
const submit = sf.createHandleSubmit(form, (it) => {
	doSomething({ login: it.login, password: it.password });
});
const loginField = sf.createField({ form, name: 'login' });
const passwordField = sf.createField({ 
	form,
	name: 'password',
	validation: (it) => it?.length < 6 && 'Minimum length is 6'
});

return (
	<form onSubmit={submit}>
		<input 
			type="text" 
			onChange={(ev) => loginField.onChange(ev.currentTarget.value)}
			value={loginField.value}
		/>
		<p>{loginField.error}</p>
		<input 
			type="password" 
			onChange={(ev) => passwordField.onChange(ev.currentTarget.value)}
			value={passwordField.value}
		/>
		<p>{passwordField.error}</p>
	</form>
)
```

## [Valibot](https://valibot.dev/) usage
Package ship with valibot integration by default.
**Why valibot, and not XYZ?**
Valibot is lightweight, highly modular and easy to extend, so it's feel like best bet for now

```tsx
const FormSchema = v.object({ 
	email: v.pipe(v.string(), v.email('Email is not valid')), 
	password: v.pipe(v.string(), v.minLength(6, 'Minimum length is 6'))
})
type FormSchema = typeof FormSchema;

// asValibotForm is just a shortcut of modules that make use of valibot potential as validation library for forms
const [form, submit] = sf.asValibotForm(
	sf.createForm(),
	FormSchema,
	(it) => {
		doSomething({ login: it.login, password: it.password });
	}
);
// Shortcut of createField, so you don't need to set form explicit
const register = sf.createRegistry(form);
// handleHTMLInput will transform field to fit html input
const loginField = sf.handleHtmlInput(register('login'), 'onChange');
const passwordField = sf.handleHtmlInput(register('password'), 'onChange');

return (
	<form onSubmit={submit}>
		<input 
			type="text" 
			{...loginField}
		/>
		<input 
			type="password" 
			{...passwordField}
		/>
	</form>
)
```

## Some advanced usages

- `/*@once*/`
	This comment tell SolidJS compiler to treat this line as staticValue, so you can inline field creation in inputs
```tsx
	<input 
			type="text" 
			{.../*@once*/sf.handleHtmlInput(register('password'))}
		/>
```
- PathField
	Default field that only allow shallow keys will suit 99% of your need, but if you really need to use deep object you can use PathField
```tsx
const form = sf.createForm({ very: { deep: { field: '' } } })
const deepField = sf.createPathField({ form, name: 'very.deep.field'  })
	return <Input {...deepField} />
```
- Components
	Every field is extension of FieldCore that return common api for field, so you can just spread it in most scenarios or if you create you own component that will be only used with @untlsn/solid-form you can extend your props with FieldCore or LooseFieldCore if you expect to allow undefined
	```tsx
	function Input(props: { label: string } & sf.LooseFieldCore<string>) {
		return (
			<div>
				<p>{props.label}</p>
				<input 
					type="text" 
					onChange={(ev) => props.onChange(ev.currentTarget.value)}
					value={props.value}
				/>
				<p>{props.error}</p>
			</div>
		)
	}
```

# Credits
High credits for:
Creators of [React Hook Form](https://react-hook-form.com/) - for inspiraction with register and path api
Creator of [valibot](https://valibot.dev/) and [modular-forms](https://modularforms.dev/)[Fabian Hiller](https://github.com/fabian-hiller) - for many inspirations for api and valibot spescialy now with pipe api
Creator of solid [https://github.com/ryansolid](https://github.com/ryansolid) - because without solid and it's api this library will be much more heavy or even don't exist at all

# License
This library is completely free under the [MIT license](https://github.com/untlsn/solid-form/blob/main/LICENSE). At most you can tip a star on [GitHub](https://github.com/untlsn/solid-form)
