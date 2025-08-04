import { useEffect } from 'react'
import { IoLogoLinkedin } from "react-icons/io"
import { RiInstagramLine } from "react-icons/ri"
import { FaXTwitter } from "react-icons/fa6";
import { FaFacebookF } from "react-icons/fa6";
import { CiYoutube } from "react-icons/ci";
import { CiLinkedin } from "react-icons/ci";
import { MdOutlineStarBorder, MdOutlineStarPurple500 } from 'react-icons/md'
import { LiaTimesSolid } from "react-icons/lia"

const DoctorPublicProfileModal = ({ isOpen, onClose, doctorData, reviews }) => {
  // lock background scroll
  useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  const fullName = `Dr. ${doctorData?.firstName ?? ''} ${doctorData?.lastName ?? ''}`.trim()
  const specialization = doctorData?.medicalCategory || '—'
  const city = doctorData?.city || '—'
  const languages = Array.isArray(doctorData?.languages) ? doctorData.languages : []
  const diseases = Array.isArray(doctorData?.customTreatments) ? doctorData.customTreatments : []
  const publication = Array.isArray(doctorData?.publication) ? doctorData.publication : []
  const education = Array.isArray(doctorData?.education) ? doctorData.education : []
  const certificates = Array.isArray(doctorData?.certificate) ? doctorData.certificate : []
  const video = doctorData?.video
  const totalReviews = Array.isArray(reviews) ? reviews.length : 0
  const averageRating = totalReviews
  ? reviews.reduce((sum, r) => sum + (Number(r?.rating) || 0), 0) / totalReviews
  : 0

  console.log("Doctor Data:", doctorData.publication);

  // round to nearest whole star
  const fullStars = Math.round(averageRating)
  const emptyStars = Math.max(0, 5 - fullStars)

  // helper to normalize URLs
  const normalizeUrl = (url) => {
    if (!url) return "";
    if (/^https?:\/\//i.test(url)) return url;
    return `https://${url}`;
  };

  const socials = [
  { key: "facebook",  url: doctorData?.facebook,  Icon: FaFacebookF,   label: "Facebook" },
  { key: "instagram", url: doctorData?.instagram, Icon: RiInstagramLine, label: "Instagram" },
  { key: "twitter",   url: doctorData?.twitter,   Icon: FaXTwitter,     label: "X (Twitter)" },
  { key: "youtube",   url: doctorData?.youtube,   Icon: CiYoutube,      label: "YouTube" },
  { key: "linkedin",  url: doctorData?.linkedin,  Icon: CiLinkedin,     label: "LinkedIn" },
];

const visibleSocials = socials.filter(s => !!s.url);


  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white w-full max-w-3xl mx-auto my-8 rounded-md shadow p-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">My experience</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
            aria-label="Close"
          >
            <LiaTimesSolid className="text-xl" />
          </button>
        </div>

        {/* Doctor card */}
        <section className="flex gap-4 p-4 mt-4 bg-gray-100 rounded">
          <img
            className="w-[100px] h-[120px] object-cover rounded"
            src={doctorData?.profilePicture}
            alt={`${fullName} profile`}
          />
          <div className="text-sm">
            <div className="font-medium">{fullName}</div>
            <div>Specialization: {specialization}</div>
            <div>Location: {city}</div>

            {/* Reviews */}
            <div className="mt-2 flex items-center gap-2">
                <div className="flex items-center">
                    {[...Array(fullStars)].map((_, i) => (
                    <MdOutlineStarPurple500 key={`full-${i}`} className="text-[#00c3a5] text-xl" />
                    ))}
                    {[...Array(emptyStars)].map((_, i) => (
                    <MdOutlineStarBorder key={`empty-${i}`} className="text-[#00c3a5]" />
                    ))}
                </div>
                <span className="text-sm text-gray-600">
                    {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
                </span>
                </div>
          </div>
        </section>

        {/* Diseases */}
        {diseases.length > 0 && (
          <section className="mt-6">
            <h3 className="font-semibold">Diseases Treated</h3>
            <ul className="list-disc pl-5 mt-2">
              {diseases.map((d, i) => <li key={i}>{d}</li>)}
            </ul>
          </section>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <section className="mt-6">
            <h3 className="font-semibold">Languages</h3>
            <p className="mt-2">{languages.join(', ')}</p>
          </section>
        )}

        {/* Experience / About */}
        {doctorData?.aboutMe && (
          <section className="mt-6">
            <h3 className="font-semibold">Experience</h3>
            <p className="mt-2 whitespace-pre-wrap">{doctorData.experience}</p>
          </section>
        )}

        {/* Publications */}
        {publication.length > 0 && (
          <section className="mt-6">
            <h3 className="font-semibold">Publications</h3>
            <ul className="list-disc pl-5 mt-2">
              {publication.map((p, i) => <li key={i}>{p}</li>)}
            </ul>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section className="mt-6">
            <h3 className="font-semibold">Education</h3>
            <ul className="list-disc pl-5 mt-2">
              {education.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          </section>
        )}

        {/* Certificates */}
        {certificates.length > 0 && (
          <section className="mt-6">
            <h3 className="font-semibold">Certificates</h3>
            <div className="mt-2 grid grid-cols-2 gap-3">
              {certificates.map((url, i) => (
                <img key={i} src={url} alt={`Certificate ${i + 1}`} className="w-full h-32 object-cover rounded" />
              ))}
            </div>
          </section>
        )}

        {/* Video */}
        {video && (
          <section className="mt-6">
            <h3 className="font-semibold">Video</h3>
            <video className="mt-2 w-full rounded" controls src={video} />
          </section>
        )}

        {/* Social Media */}
        {visibleSocials.length > 0 && (
        <section className="mt-6">
            <h2 className="text-lg font-medium mb-3">Social Profiles</h2>
            <div className="flex items-center gap-3">
            {visibleSocials.map(({ key, url, Icon, label }) => (
                <a
                key={key}
                href={normalizeUrl(url)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 text-gray-600 hover:text-white hover:bg-[#00c3a5] transition"
                title={label}
                >
                <Icon className="text-xl" />
                </a>
            ))}
            </div>
        </section>
        )}

      </div>
    </div>
  )
}

export default DoctorPublicProfileModal
