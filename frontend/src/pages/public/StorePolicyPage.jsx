import { useLocation } from 'react-router-dom';

const POLICIES = {
  '/privacy': {
    title: 'Privacy Policy',
    intro: 'WoodCraft collects only the details needed to craft, deliver, and support your furniture order.',
    sections: [
      {
        heading: 'What we keep',
        body: 'Account name, email, phone, delivery address, and order history are stored so we can build, ship, and assemble your furniture. Profile photos and custom-request reference images are saved only when you upload them.',
      },
      {
        heading: 'How it is used',
        body: 'We use this information to process orders, send delivery updates, reply to customization requests, and keep your wishlist and cart available on your account. We do not sell customer lists.',
      },
    ],
  },
  '/terms': {
    title: 'Terms of Service',
    intro: 'These terms cover shopping for solid-wood furniture, made-to-order pieces, and delivery from the WoodCraft studio.',
    sections: [
      {
        heading: 'Orders and materials',
        body: 'Product pages describe material, wood type, dimensions, seating, and assembly. Natural grain, tone, and small variations are part of solid timber and are not defects.',
      },
      {
        heading: 'Custom work',
        body: 'Customization requests and public custom requirements are quotes until you accept the reply and place an order. Lead times depend on timber, finish, and workshop capacity.',
      },
    ],
  },
  '/shipping': {
    title: 'Delivery & Returns',
    intro: 'Large furniture is scheduled for white-glove delivery, with assembly noted on each product.',
    sections: [
      {
        heading: 'Delivery',
        body: 'Each piece shows an estimated delivery window. Shipping is calculated at checkout from the store delivery settings, and orders above the free-shipping threshold ship without a freight charge.',
      },
      {
        heading: 'Returns',
        body: 'Standard catalog pieces can be reviewed for replacement within 7 days if they arrive damaged. Made-to-order dimensions and custom finishes are built for your room and are not restocked.',
      },
    ],
  },
};

export function StorePolicyPage() {
  const { pathname } = useLocation();
  const policy = POLICIES[pathname] || POLICIES['/shipping'];

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem', maxWidth: 800 }}>
      <h1>{policy.title}</h1>
      <p style={{ color: 'var(--neutral-600)', margin: '0.75rem 0 1.5rem' }}>{policy.intro}</p>
      {policy.sections.map((section) => (
        <section key={section.heading} className="surface-card" style={{ marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>{section.heading}</h2>
          <p style={{ color: 'var(--neutral-700)' }}>{section.body}</p>
        </section>
      ))}
    </div>
  );
}

export default StorePolicyPage;
