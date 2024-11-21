from get_domain_key import get_domain_key
from record import RecordVersion


def test_get_domain_key(domain_name, domain_key):
    result = get_domain_key(domain_name)
    assert result["pubkey"] == domain_key


def test_get_subdomain_key(subdomain_name, subdomain_key, domain_key):
    result = get_domain_key(subdomain_name)
    assert result["pubkey"] == subdomain_key
    assert result["parent"] == domain_key


def test_get_record_subdomain_key(
    record_subdomain_name, record_subdomain_key, domain_key
):
    result = get_domain_key(record_subdomain_name, RecordVersion.V1)
    assert result["pubkey"] == record_subdomain_key
    assert result["parent"] == domain_key
