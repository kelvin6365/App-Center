export class TenantUtil {
  // convert string to lowercase with snake string
  convertDomainName(name: string) {
    return name.toLowerCase().replace(/\s+/g, '-');
  }
}
