/** Critères d'IMC du GLP-1 Bridge (FAQ CMS) : IMC calculé et seuil qui s'applique selon les diagnostics déclarés. */
import { T, num } from './_kit';
import { P } from '../engine/index';
import type { MiniSpec } from '../mini-types';
export default (l: 'en' | 'es'): MiniSpec => ({
  title: T(l, 'Which BMI threshold applies to you', 'Qué umbral de IMC le corresponde'),
  cta: T(l, 'See the Bridge price for your drug', 'Ver el precio del Bridge para su medicamento'),
  inputs: [
    { id: 'h', label: T(l, 'Height', 'Estatura'), def: 66, unit: 'in', max: 96 },
    { id: 'w', label: T(l, 'Weight when you started a GLP-1', 'Peso al empezar el GLP-1'), def: 230, unit: 'lb', max: 900 },
    { id: 'c', label: T(l, 'Diagnosis on file', 'Diagnóstico registrado'), def: 0, options: [
      { value: '0', label: T(l, 'None of the listed ones', 'Ninguno de la lista') },
      { value: '1', label: T(l, 'Heart failure (HFpEF), uncontrolled blood pressure or CKD 3a+', 'Insuficiencia cardíaca (HFpEF), presión no controlada o ERC 3a+') },
      { value: '2', label: T(l, 'Prediabetes, past heart attack or stroke, or PAD', 'Prediabetes, infarto o ictus previo, o EAP') },
    ] },
  ],
  run: (v) => {
    const bmi = v.h > 0 ? (703 * v.w) / (v.h * v.h) : 0;
    const b = P.bridge.bmi;
    const thr = v.c === 1 ? b.withHfpefHtnCkd : v.c === 2 ? b.withPrediabetesMiStrokePad : b.alone;
    const ok = bmi >= thr;
    return {
      head: [T(l, 'Your BMI at the start', 'Su IMC al empezar'), num(bmi, l, 1)],
      rows: [[T(l, 'Threshold that applies', 'Umbral aplicable'), `≥ ${thr}`], [T(l, 'Meets the BMI criterion', 'Cumple el criterio de IMC'), ok ? T(l, 'Yes', 'Sí') : T(l, 'No', 'No')]],
      note: T(l, 'CMS also excludes people whose GLP-1 is covered by Part D (diabetes, sleep apnea, MASH). Your prescriber attests; this is not medical advice.', 'CMS excluye además a quien tiene el GLP-1 cubierto por la Parte D (diabetes, apnea, MASH). Su médico certifica; esto no es consejo médico.'),
    };
  },
});
