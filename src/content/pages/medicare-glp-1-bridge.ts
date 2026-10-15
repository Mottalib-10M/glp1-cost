import { definePage } from '../../lib/page-types';
import { cash, BR, PD, $en, $es } from './_util';

export default definePage({
  id: 'medicare-glp-1-bridge', group: 'medicare', order: 40,
  mini: 'bridgeSaving',
  related: ['does-medicare-cover-wegovy', 'wegovy-cost', 'zepbound-cost', 'foundayo-cost', 'medicare-part-d-cap', 'medicaid-glp-1-coverage'],
  sources: ['cmsBridge', 'cmsBridgeProviders', 'medicareBridge', 'cmsBalance', 'ecfrPartD'],
  en: {
    slug: 'medicare-glp-1-bridge', nav: 'Medicare GLP-1 Bridge ($50)', card: 'The $50 a month Medicare program for Wegovy, Zepbound KwikPen and Foundayo',
    title: `Medicare GLP-1 Bridge 2026: ${$en(BR.copay)} Wegovy, Zepbound, Foundayo`,
    description: `Medicare GLP-1 Bridge: ${$en(BR.copay)} a month for Wegovy, Zepbound KwikPen and Foundayo from July 2026 to December 2027, who qualifies, the BMI rules and the savings.`,
    h1: 'The Medicare GLP-1 Bridge: $50 a month for weight-loss GLP-1s',
    intro: (h) => `Since July 1, 2026, people with Medicare Part D can get Wegovy, Zepbound KwikPen or Foundayo for weight management at ${h.usd(BR.copay)} a month, until December 31, 2027.`,
    resume: (h) => `The Medicare GLP-1 Bridge is a short-term demonstration run by CMS, not a Part D benefit. From July 1, 2026 to December 31, 2027 it gives Medicare Part D enrollees access to three weight-management drugs, Wegovy in every form, Zepbound in the KwikPen only and Foundayo, for a flat copay of ${h.usd(BR.copay)} a month. To qualify, you must be enrolled in a standalone drug plan or a Medicare Advantage plan with drug coverage, be prescribed the drug to reduce and maintain body weight, and have had, when you started a GLP-1, a body-mass index of at least ${BR.bmi.alone}, or ${BR.bmi.withHfpefHtnCkd} with heart failure with preserved ejection fraction, uncontrolled hypertension or kidney disease stage 3a or worse, or ${BR.bmi.withPrediabetesMiStrokePad} with prediabetes, a past heart attack or stroke, or peripheral artery disease. People whose GLP-1 is covered by Part D for diabetes, sleep apnea or MASH are excluded. The ${h.usd(BR.copay)} does not count toward the ${h.usd(PD(2026).oopCap)} Part D cap and Extra Help does not reduce it.`,
    body: (h) => `
<h2>Why a bridge, and to what</h2>
<p>Federal law excludes drugs used for weight loss from Part D, and the definition of a Part D drug in 42 CFR 423.100 repeats that exclusion. CMS designed the BALANCE Model to negotiate prices and coverage for these drugs in Medicaid and Medicare; the Medicare part was expected in January 2027. CMS announced that BALANCE will not launch in Part D in 2027 and extended the Bridge through December 31, 2027 instead. The Bridge sits outside Part D: a single central processor handles prior authorizations, claims and pharmacy payments, your plan does not need to opt in, and every pharmacy can fill it.</p>
<h2>What it costs, and what it saves</h2>
<p>The copay is ${h.usd(BR.copay)} for a month’s supply, whatever the strength. The Part D deductible does not apply, nothing counts toward your yearly out-of-pocket total, and the low-income subsidy does not lower it. Against the self-pay prices, the saving is large: ${h.usd(cash('wegovy', '2.4') - BR.copay)} a month on Wegovy 2.4 mg, ${h.usd(cash('zepbound', 'kwikpen-10') - BR.copay)} on a 10 mg Zepbound KwikPen, ${h.usd(cash('foundayo', '9') - BR.copay)} on Foundayo 9 mg. Over the eighteen months of the program a Wegovy patient keeps ${h.usd(18 * (cash('wegovy', '2.4') - BR.copay))}.</p>
<h2>Which threshold applies to you</h2>
<p>The criteria apply at the time you started GLP-1 therapy, which may be before you joined Medicare or before July 2026. CMS gives the example of someone who started at a BMI of 37 and weighs in at 34 today: the prescriber attests the starting value. The tool below computes a BMI from height and weight and shows which threshold the listed diagnoses set. It is arithmetic, not an eligibility decision: your prescriber attests under penalty of perjury, and CMS can check the attestation against Medicare data.</p>
${h.mini('bridgeBmi')}
<h2>How to get it</h2>
<ol>
<li><strong>Your prescriber sends a prior authorization</strong> to the Bridge’s central processor, by fax or electronic portal. CMS says decisions come within 72 hours and are mailed to you.</li>
<li><strong>The pharmacy fills the prescription</strong> and bills the Bridge, not your plan. You pay ${h.usd(BR.copay)}.</li>
<li><strong>Pen needles are not covered</strong> for the Zepbound KwikPen; buy them separately.</li>
</ol>
<h2>Who is left out</h2>
<p>People in private fee-for-service plans, cost plans, PACE and a few other arrangements without a standalone drug plan are not eligible. Ozempic, Mounjaro and other diabetes GLP-1s are not Bridge drugs, nor are Zepbound vials and single-dose pens. If your GLP-1 is prescribed for type 2 diabetes, sleep apnea or MASH, your Part D plan covers it and the Bridge does not apply.</p>`,
    faqs: (h) => [
      { q: 'How much does Wegovy cost through the Medicare GLP-1 Bridge?', a: `${h.usd(BR.copay)} for a month’s supply, at any strength and in pen or tablet form, from July 1, 2026 to December 31, 2027. The same copay applies to the Zepbound KwikPen and Foundayo. It is paid outside your Part D plan and does not count toward the yearly cap.` },
      { q: 'Who qualifies for the Medicare GLP-1 Bridge?', a: `Part D enrollees prescribed the drug to reduce and maintain weight, with a starting BMI of ${BR.bmi.alone} or more, ${BR.bmi.withHfpefHtnCkd} with certain heart or kidney conditions, or ${BR.bmi.withPrediabetesMiStrokePad} with prediabetes or past cardiovascular events. People whose GLP-1 is covered by Part D for diabetes, sleep apnea or MASH are excluded.` },
      { q: 'Does Extra Help lower the $50 Bridge copay?', a: `No. CMS states that no low-income subsidy applies to drugs furnished under the Bridge, because the program runs outside the Part D benefit. Everyone who qualifies pays ${h.usd(BR.copay)} a month, and the amount does not count toward the ${h.usd(PD(2026).oopCap)} out-of-pocket cap.` },
      { q: 'Is Ozempic covered by the Medicare GLP-1 Bridge?', a: 'No. The Bridge covers Wegovy in all forms, the Zepbound KwikPen and Foundayo, prescribed for weight management. Ozempic is a diabetes drug that Part D covers for its labeled uses; prescribed only for weight loss, it is covered by neither.' },
      { q: 'What happens after December 2027?', a: 'CMS has extended the Bridge through December 31, 2027 while it gathers data for a possible BALANCE Model in Part D. No rule for 2028 has been published; we will update this page when CMS announces one. Bridge users should plan for a change of route in 2028.' },
    ],
  },
  es: {
    slug: 'medicare-glp-1-bridge', nav: 'Medicare GLP-1 Bridge ($50)', card: 'El programa de Medicare de 50 dólares al mes para Wegovy, Zepbound KwikPen y Foundayo',
    title: `Medicare GLP-1 Bridge 2026: Wegovy y Zepbound a ${$es(BR.copay)} al mes`,
    description: `Medicare GLP-1 Bridge: ${$es(BR.copay)} al mes por Wegovy, Zepbound KwikPen y Foundayo de julio de 2026 a diciembre de 2027, requisitos, criterios de IMC y ahorro.`,
    h1: 'El Medicare GLP-1 Bridge: 50 dólares al mes por los GLP-1 para bajar de peso',
    intro: (h) => `Desde el 1 de julio de 2026, las personas con la Parte D de Medicare pueden recibir Wegovy, Zepbound KwikPen o Foundayo para controlar el peso por ${h.usd(BR.copay)} al mes, hasta el 31 de diciembre de 2027.`,
    resume: (h) => `El Medicare GLP-1 Bridge es una demostración temporal de CMS, no un beneficio de la Parte D. Del 1 de julio de 2026 al 31 de diciembre de 2027 da acceso a las personas inscritas en la Parte D a tres medicamentos para controlar el peso, Wegovy en todas sus formas, Zepbound solo en KwikPen y Foundayo, por un copago fijo de ${h.usd(BR.copay)} al mes. Para calificar hay que estar en un plan de medicamentos independiente o en un plan Medicare Advantage con cobertura de medicamentos, tener la receta para reducir y mantener el peso y haber tenido, al empezar un GLP-1, un índice de masa corporal de al menos ${BR.bmi.alone}, o de ${BR.bmi.withHfpefHtnCkd} con insuficiencia cardíaca con fracción de eyección preservada, hipertensión no controlada o enfermedad renal en etapa 3a o peor, o de ${BR.bmi.withPrediabetesMiStrokePad} con prediabetes, un infarto o ictus previo o enfermedad arterial periférica. Quedan fuera las personas cuyo GLP-1 cubre la Parte D por diabetes, apnea del sueño o MASH. Los ${h.usd(BR.copay)} no cuentan para el tope de ${h.usd(PD(2026).oopCap)} de la Parte D y la Ayuda Adicional no los reduce.`,
    body: (h) => `
<h2>Por qué un puente, y hacia qué</h2>
<p>La ley federal excluye de la Parte D los medicamentos usados para bajar de peso, y la definición de medicamento de la Parte D en el 42 CFR 423.100 repite esa exclusión. CMS diseñó el modelo BALANCE para negociar precios y cobertura de estos medicamentos en Medicaid y Medicare; la parte de Medicare se esperaba para enero de 2027. CMS anunció que BALANCE no empezará en la Parte D en 2027 y prolongó el Bridge hasta el 31 de diciembre de 2027. El Bridge funciona fuera de la Parte D: un procesador central único gestiona las autorizaciones previas, las reclamaciones y los pagos a las farmacias; su plan no tiene que adherirse y cualquier farmacia puede surtir la receta.</p>
<h2>Cuánto cuesta y cuánto ahorra</h2>
<p>El copago es de ${h.usd(BR.copay)} por un mes de suministro, sea cual sea la concentración. No se aplica el deducible de la Parte D, nada cuenta para su total anual de gastos de bolsillo y el subsidio para personas de bajos ingresos no lo reduce. Frente a los precios de autopago, el ahorro es grande: ${h.usd(cash('wegovy', '2.4') - BR.copay)} al mes con Wegovy de 2.4 mg, ${h.usd(cash('zepbound', 'kwikpen-10') - BR.copay)} con una KwikPen de Zepbound de 10 mg y ${h.usd(cash('foundayo', '9') - BR.copay)} con Foundayo de 9 mg. En los dieciocho meses del programa, un paciente de Wegovy se ahorra ${h.usd(18 * (cash('wegovy', '2.4') - BR.copay))}.</p>
<h2>Qué umbral le corresponde</h2>
<p>Los criterios se aplican al momento en que empezó el tratamiento con GLP-1, que puede ser anterior a su inscripción en Medicare o a julio de 2026. CMS da el ejemplo de una persona que empezó con un IMC de 37 y hoy tiene 34: el médico certifica el valor inicial. La herramienta calcula un IMC a partir de la estatura y el peso y muestra el umbral que fijan los diagnósticos de la lista. Es aritmética, no una decisión: su médico lo certifica bajo pena de perjurio y CMS puede contrastarlo con los datos de Medicare.</p>
${h.mini('bridgeBmi')}
<h2>Cómo obtenerlo</h2>
<ol>
<li><strong>Su médico envía una autorización previa</strong> al procesador central del Bridge, por fax o por portal electrónico. CMS indica que la decisión llega en 72 horas y se le envía por correo.</li>
<li><strong>La farmacia surte la receta</strong> y factura al Bridge, no a su plan. Usted paga ${h.usd(BR.copay)}.</li>
<li><strong>Las agujas no están cubiertas</strong> para la KwikPen de Zepbound; se compran aparte.</li>
</ol>
<h2>Quién queda fuera</h2>
<p>No califican las personas en planes privados de pago por servicio, planes de costo, PACE y algunas otras modalidades sin plan de medicamentos independiente. Ozempic, Mounjaro y los demás GLP-1 para la diabetes no son medicamentos del Bridge, ni tampoco los frascos ni las plumas de dosis única de Zepbound. Si su GLP-1 se receta para diabetes tipo 2, apnea del sueño o MASH, lo cubre su plan de la Parte D y el Bridge no se aplica.</p>`,
    faqs: (h) => [
      { q: '¿Cuánto cuesta Wegovy con el Medicare GLP-1 Bridge?', a: `${h.usd(BR.copay)} por un mes de suministro, en cualquier concentración y en pluma o comprimido, del 1 de julio de 2026 al 31 de diciembre de 2027. El mismo copago vale para la KwikPen de Zepbound y para Foundayo. Se paga fuera de su plan de la Parte D y no cuenta para el tope anual.` },
      { q: '¿Quién califica para el Medicare GLP-1 Bridge?', a: `Las personas en la Parte D con receta para reducir y mantener el peso, con un IMC inicial de ${BR.bmi.alone} o más, de ${BR.bmi.withHfpefHtnCkd} con ciertas enfermedades cardíacas o renales, o de ${BR.bmi.withPrediabetesMiStrokePad} con prediabetes o antecedentes cardiovasculares. Quedan fuera quienes tienen el GLP-1 cubierto por la Parte D por diabetes, apnea del sueño o MASH.` },
      { q: '¿La Ayuda Adicional reduce el copago de 50 dólares?', a: `No. CMS indica que no se aplica ningún subsidio para personas de bajos ingresos a los medicamentos del Bridge, porque el programa funciona fuera de la Parte D. Todos pagan ${h.usd(BR.copay)} al mes, y ese monto no cuenta para el tope de ${h.usd(PD(2026).oopCap)}.` },
      { q: '¿El Medicare GLP-1 Bridge cubre Ozempic?', a: 'No. El Bridge cubre Wegovy en todas sus formas, la KwikPen de Zepbound y Foundayo, recetados para controlar el peso. Ozempic es un medicamento para la diabetes que la Parte D cubre para sus usos aprobados; recetado solo para bajar de peso, no lo cubre ninguno de los dos.' },
    ],
  },
});
