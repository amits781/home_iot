package com.aidyn.iot.repository;

import com.aidyn.iot.entity.DeviceActivity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface DeviceActivityRepository extends JpaRepository<DeviceActivity, Integer> {

    Optional<DeviceActivity> findTopByEndTimeIsNullOrderByStartTimeDesc();

    /**
     * A still-ongoing activity (endTime null, e.g. motor currently on) is always included
     * regardless of the range, matching how the UI has always treated in-progress entries.
     */
    @Query("SELECT a FROM DeviceActivity a "
            + "WHERE a.startTime >= :start AND (a.endTime <= :end OR a.endTime IS NULL) "
            + "ORDER BY a.startTime DESC")
    Page<DeviceActivity> findByDateRange(@Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end, Pageable pageable);

    @Query("SELECT COALESCE(SUM(a.duration), 0) FROM DeviceActivity a "
            + "WHERE a.startTime >= :start AND (a.endTime <= :end OR a.endTime IS NULL)")
    Long sumDurationByDateRange(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}
