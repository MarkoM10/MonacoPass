export function validateKupac(form: any) {
  const errors: Record<string, string> = {};

  if (!form.ime?.trim()) errors.ime = "Polje 'Ime' je obavezno.";
  if (!form.prezime?.trim()) errors.prezime = "Polje 'Prezime' je obavezno.";
  if (!form.email?.trim()) {
    errors.email = "Polje 'Email' je obavezno.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Email adresa "Email" je nevalidna.';
  }

  if (!form.potvrda_emaila?.trim()) {
    errors.potvrda_emaila = "Polje 'Potvrda emaila' je obavezno.";
  } else if (form.potvrda_emaila !== form.email) {
    errors.potvrda_emaila = "Email adrese se ne poklapaju.";
  }

  if (!form.adresa1?.trim()) errors.adresa1 = "Polje 'Adresa 1' je obavezno.";
  if (!form.postanski_broj?.trim())
    errors.postanski_broj = "Polje 'Poštanski broj' je obavezno.";
  if (!form.mesto?.trim()) errors.mesto = "Polje 'Mesto' je obavezno.";
  if (!form.drzava?.trim()) errors.drzava = "Polje 'Država' je obavezno.";

  return errors;
}
