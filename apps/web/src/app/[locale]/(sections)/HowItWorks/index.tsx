import { steps } from './data';

export async function HowItWorks() {
  return (
    <section className="py-10">
      <div className="container mx-auto px-4 lg:px-9">
        <h2 className="font-title_two text-primary text-center font-bold mb-4">Como funciona?</h2>
        <p className="font-body_one mx-auto text-center mb-8">
          Guarde seus momentos de forma única e reviva cada detalhe com o Polotrip. Simples,
          intuitivo e memorável!
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start px-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-gray-50 shadow-md rounded-lg p-6 flex flex-col items-center border border-gray-100 h-full"
            >
              <div>{step.icon}</div>
              <h3 className="text-left font-title_three mt-4 font-semibold">{step.title}</h3>
              <p className="font_body-one mt-4">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
