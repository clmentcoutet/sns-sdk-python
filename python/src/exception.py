from enum import Enum


class ExceptionType(Enum):
    SymbolNotFound = "SymbolNotFound"
    InvalidSubdomain = "InvalidSubdomain"
    FavouriteDomainNotFound = "FavouriteDomainNotFound"
    MissingParentOwner = "MissingParentOwner"
    U32Overflow = "U32Overflow"
    InvalidBufferLength = "InvalidBufferLength"
    U64Overflow = "U64Overflow"
    NoRecordData = "NoRecordData"
    InvalidRecordData = "InvalidRecordData"
    UnsupportedRecord = "UnsupportedRecord"
    InvalidEvmAddress = "InvalidEvmAddress"
    InvalidInjectiveAddress = "InvalidInjectiveAddress"
    InvalidARecord = "InvalidARecord"
    InvalidAAAARecord = "InvalidAAAARecord"
    InvalidRecordInput = "InvalidRecordInput"
    InvalidSignature = "InvalidSignature"
    AccountDoesNotExist = "AccountDoesNotExist"
    MultipleRegistries = "MultipleRegistries"
    InvalidReverseTwitter = "InvalidReverseTwitter"
    NoAccountData = "NoAccountData"
    InvalidInput = "InvalidInput"
    InvalidDomain = "InvalidDomain"
    InvalidCustomBg = "InvalidCustomBackground"
    UnsupportedSignature = "UnsupportedSignature"
    RecordDoesNotSupportGuardianSig = "RecordDoesNotSupportGuardianSig"
    RecordIsNotSigned = "RecordIsNotSigned"
    UnsupportedSignatureType = "UnsupportedSignatureType"
    InvalidSolRecordV2 = "InvalidSolRecordV2"
    MissingVerifier = "MissingVerifier"
    PythFeedNotFound = "PythFeedNotFound"
    InvalidRoA = "InvalidRoA"
    InvalidPda = "InvalidPda"
    InvalidParent = "InvalidParent"
    NftRecordNotFound = "NftRecordNotFound"
    PdaOwnerNotAllowed = "PdaOwnerNotAllowed"
    DomainDoesNotExist = "DomainDoesNotExist"
    RecordMalformed = "RecordMalformed"
    CouldNotFindNftOwner = "CouldNotFindNftOwner"
    WrongValidation = "WrongValidation"


class SNSException(Exception):
    def __init__(self, error_type: ExceptionType, message: str = ""):
        super().__init__(message)
        self.name = "SNSException"
        self.type = error_type

    def __str__(self) -> str:
        # Custom string representation for the error
        return f"{self.name} ({self.type.value}): {self.args[0]}"


class SymbolNotFoundException(SNSException):
    def __init__(self, message: str = ""):
        super().__init__(ExceptionType.SymbolNotFound, message)


class InvalidSubdomainException(SNSException):
    def __init__(self, message: str = ""):
        super().__init__(ExceptionType.InvalidSubdomain, message)


class FavouriteDomainNotFoundException(SNSException):
    def __init__(self, message: str = ""):
        super().__init__(ExceptionType.FavouriteDomainNotFound, message)


class MissingParentOwnerException(SNSException):
    def __init__(self, message: str = ""):
        super().__init__(ExceptionType.MissingParentOwner, message)


class U32OverflowException(SNSException):
    def __init__(self, message: str = ""):
        super().__init__(ExceptionType.U32Overflow, message)


class InvalidBufferLengthException(SNSException):
    def __init__(self, message: str = ""):
        super().__init__(ExceptionType.InvalidBufferLength, message)


class U64OverflowException(SNSException):
    def __init__(self, message: str = ""):
        super().__init__(ExceptionType.U64Overflow, message)


class NoRecordDataException(SNSException):
    def __init__(self, message: str = ""):
        super().__init__(ExceptionType.NoRecordData, message)


class InvalidRecordDataException(SNSException):
    def __init__(self, message: str = ""):
        super().__init__(ExceptionType.InvalidRecordData, message)


class UnsupportedRecordException(SNSException):
    def __init__(self, message: str = ""):
        super().__init__(ExceptionType.UnsupportedRecord, message)


class InvalidEvmAddressException(SNSException):
    def __init__(self, message: str = ""):
        super().__init__(ExceptionType.InvalidEvmAddress, message)


class InvalidInjectiveAddressException(SNSException):
    def __init__(self, message: str = ""):
        super().__init__(ExceptionType.InvalidInjectiveAddress, message)


class InvalidARecordException(SNSException):
    def __init__(self, message: str = ""):
        super().__init__(ExceptionType.InvalidARecord, message)


class InvalidAAAARecordException(SNSException):
    def __init__(self, message: str = ""):
        super().__init__(ExceptionType.InvalidAAAARecord, message)


class InvalidRecordInputException(SNSException):
    def __init__(self, message: str = ""):
        super().__init__(ExceptionType.InvalidRecordInput, message)


class InvalidSignatureException(SNSException):
    def __init__(self, message: str = ""):
        super().__init__(ExceptionType.InvalidSignature, message)


class AccountDoesNotExistException(SNSException):
    def __init__(self, message: str = ""):
        super().__init__(ExceptionType.AccountDoesNotExist, message)


class MultipleRegistriesException(SNSException):
    def __init__(self, message: str = ""):
        super().__init__(ExceptionType.MultipleRegistries, message)


class InvalidReverseTwitterException(SNSException):
    def __init__(self, message: str = ""):
        super().__init__(ExceptionType.InvalidReverseTwitter, message)


class NoAccountDataException(SNSException):
    def __init__(self, message: str = ""):
        super().__init__(ExceptionType.NoAccountData, message)


class InvalidInputException(SNSException):
    def __init__(self, message: str = ""):
        super().__init__(ExceptionType.InvalidInput, message)


class InvalidDomainException(SNSException):
    def __init__(self, message: str = ""):
        super().__init__(ExceptionType.InvalidDomain, message)


class InvalidCustomBgException(SNSException):
    def __init__(self, message: str = ""):
        super().__init__(ExceptionType.InvalidCustomBg, message)


class UnsupportedSignatureException(SNSException):
    def __init__(self, message: str = ""):
        super().__init__(ExceptionType.UnsupportedSignature, message)


class RecordDoesNotSupportGuardianSigException(SNSException):
    def __init__(self, message: str = ""):
        super().__init__(ExceptionType.RecordDoesNotSupportGuardianSig, message)


class RecordIsNotSignedException(SNSException):
    def __init__(self, message: str = ""):
        super().__init__(ExceptionType.RecordIsNotSigned, message)


class UnsupportedSignatureTypeException(SNSException):
    def __init__(self, message: str = ""):
        super().__init__(ExceptionType.UnsupportedSignatureType, message)


class InvalidSolRecordV2Exception(SNSException):
    def __init__(self, message: str = ""):
        super().__init__(ExceptionType.InvalidSolRecordV2, message)


class MissingVerifierException(SNSException):
    def __init__(self, message: str = ""):
        super().__init__(ExceptionType.MissingVerifier, message)


class PythFeedNotFoundException(SNSException):
    def __init__(self, message: str = ""):
        super().__init__(ExceptionType.PythFeedNotFound, message)


class InvalidRoAException(SNSException):
    def __init__(self, message: str = ""):
        super().__init__(ExceptionType.InvalidRoA, message)


class InvalidPdaException(SNSException):
    def __init__(self, message: str = ""):
        super().__init__(ExceptionType.InvalidPda, message)


class InvalidParentException(SNSException):
    def __init__(self, message: str = ""):
        super().__init__(ExceptionType.InvalidParent, message)


class NftRecordNotFoundException(SNSException):
    def __init__(self, message: str = ""):
        super().__init__(ExceptionType.NftRecordNotFound, message)


class PdaOwnerNotAllowedException(SNSException):
    def __init__(self, message: str = ""):
        super().__init__(ExceptionType.PdaOwnerNotAllowed, message)


class DomainDoesNotExistException(SNSException):
    def __init__(self, message: str = ""):
        super().__init__(ExceptionType.DomainDoesNotExist, message)


class RecordMalformedException(SNSException):
    def __init__(self, message: str = ""):
        super().__init__(ExceptionType.RecordMalformed, message)


class CouldNotFindNftOwnerException(SNSException):
    def __init__(self, message: str = ""):
        super().__init__(ExceptionType.CouldNotFindNftOwner, message)


class WrongValidationException(SNSException):
    def __init__(self, message: str = ""):
        super().__init__(ExceptionType.WrongValidation, message)


class NoLamportsDataException(Exception):
    pass
